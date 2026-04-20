import axios from "axios";
import logger from "../utils/logger.js";

let accessToken = "";

// Função de obtenção do Token
const getAccessToken = async () => {
  const credentials = Buffer.from(
    `${process.env.FATSECRET_CLIENT_ID}:${process.env.FATSECRET_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await axios.post(
    "https://oauth.fatsecret.com/connect/token",
    "grant_type=client_credentials&scope=basic",
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  accessToken = response.data.access_token;
  return accessToken;
};

export const searchFood = async (
  query: string,
  retry = false,
): Promise<any> => {
  if (!accessToken) await getAccessToken();

  try {
    const response = await axios.get(
      "https://platform.fatsecret.com/rest/server.api",
      {
        params: {
          method: "foods.search",
          search_expression: query,
          format: "json",
          max_results: 20,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data.foods?.food || [];
  } catch (error: any) {
    if (error.response?.status === 401 && !retry) {
      logger.info("Token expirado, renovando...");
      await getAccessToken();
      return searchFood(query, true);
    }

    logger.error(`Erro na busca do alimento: ${error.message}`);
    throw error;
  }
};
