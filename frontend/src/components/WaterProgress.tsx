import corpoImg from "../assets/human-body.png";

interface WaterProgressProps {
  percentage: number;
}

const WaterProgress = ({ percentage }: WaterProgressProps) => {
  const validatedPercentage = Math.max(0, Math.min(100, percentage));

  const transformValue = 100 - validatedPercentage;

  const maskStyles: React.CSSProperties = {
    WebkitMaskImage: `url(${corpoImg})`,
    maskImage: `url(${corpoImg})`,

    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",

    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",

    WebkitMaskPosition: "center bottom",
    maskPosition: "center bottom",
  };

  return (
    <div className="relative w-30 h-[270px] mx-auto overflow-hidden">
      <div className="absolute inset-0 bg-gray-200" style={maskStyles} />
      <div className="absolute inset-0" style={maskStyles}>
        <div
          className="absolute inset-0 bg-brand-mdblue transition-transform duration-1000 ease-out"
          style={{
            transform: `translateY(${transformValue}%)`,
          }}
        >
          <div className="absolute top-0 left-[-50%] w-[300%] h-12 bg-brand-lgblue/35 blur-sm animate-wave" />
        </div>
      </div>
    </div>
  );
};

export default WaterProgress;
