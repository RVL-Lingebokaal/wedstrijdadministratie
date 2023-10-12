import { useGetTeams } from "../../hooks/teams/useGetTeams";
import { LoadingSpinner } from "../../components/atoms/loading-spinner/loadingSpinner";
import TeamAddButton from "../../components/organisms/team/team-add-button/teamAddButton";
import { TeamUpdateButton } from "../../components/organisms/team/team-update-button/teamUpdateButton";

export default function Data() {
  const { data, isLoading, refetch } = useGetTeams();

  if (isLoading || !data) {
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
        Er zijn op dit moment {data.length} teams ingeschreven.
      </p>
      <div className="flex gap-3">
        <TeamAddButton refetch={refetch} />
        <TeamUpdateButton refetch={refetch} teams={data} />
      </div>
    </div>
  );
}
