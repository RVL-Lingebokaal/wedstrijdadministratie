import { useGetTeams } from "../../hooks/useGetTeams";
import { LoadingSpinner } from "../../components/atoms/loading-spinner/loadingSpinner";
import TeamAddButton from "../../components/molecules/team-add-button/teamAddButton";

export default function Data() {
  const { data, isLoading, refetch } = useGetTeams();

  if (isLoading) {
    return (
      <div>
        <h1 className="font-bold text-2xl text-primary">Data</h1>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-bold text-2xl mb-3 text-primary">Data</h1>
      <h2 className="font-bold text-xl mb-2">Ploegen</h2>
      <p className="mb-2">
        Er zijn op dit moment {data?.length ?? 0} teams ingeschreven
      </p>
      <div>
        <TeamAddButton refetch={refetch} />
      </div>
    </div>
  );
}
