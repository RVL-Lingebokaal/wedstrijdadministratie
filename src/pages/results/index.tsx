import { useGetResults } from "../../hooks/useGetResults";
import { LoadingSpinner } from "../../components/atoms/loading-spinner/loadingSpinner";
import { GridHeader } from "../../components/atoms/grid-header/gridHeader";
import { GridRow } from "../../components/atoms/grid-row/gridRow";
import { getConvertedResults } from "../../components/utils/teamUtils";

const headerItems = ["Team", "Start", "Finish", "Resultaat", "Gecorrigeerd"];

export default function Results() {
  const { data, isLoading } = useGetResults();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  const convertedData = getConvertedResults(data);

  return (
    <div className="flex w-full">
      <div className="w-full">
        <GridHeader items={headerItems} needsRounding />
        {convertedData?.map((item, index) => (
          <GridRow items={item} key={index} />
        ))}
      </div>
    </div>
  );
}
