import { LoaderCircle } from "lucide-react";

const Loader = () => {
  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 text-loader-foreground bg-loader-background z-50">

      <div className="flex flex-col w-full h-full place-content-center place-items-center">
        <div>
          <LoaderCircle size={30} className="animate-spin" />
        </div>
        <span>Loading</span>
      </div>
    </div>
  );
}

export default Loader;
