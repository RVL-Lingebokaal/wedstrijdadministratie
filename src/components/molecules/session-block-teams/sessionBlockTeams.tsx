import { AgeItem, BoatType } from "../../../models/settings";
import { Team } from "../../../models/team";
import { SessionGridHeader } from "../../atoms/grid-header/sessionGridHeader";
import { SessionGridRow } from "../../atoms/grid-row/sessionGridRow";
import { useCallback, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useUpdateBlockTeam } from "../../../hooks/teams/useUpdateBlockTeam";
import ErrorModal from "../../atoms/error-modal/errorModal";

interface SessionBlockTeamsProps {
  teams?: Team[];
  boatType: BoatType;
  ageClasses: AgeItem[];
  refetch: () => void;
  totalBlocks: Map<number, number>;
  blockTeams: Map<number, Map<BoatType, Team[]>>;
}

export function SessionBlockTeams({
  teams,
  ageClasses,
  boatType,
  refetch,
  blockTeams,
  totalBlocks,
}: SessionBlockTeamsProps) {
  const [showError, setShowError] = useState(false);
  const { mutate, error } = useUpdateBlockTeam({
    onError: () => setShowError(true),
  });

  const onClick = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;

      // dropped outside the list
      if (!destination) {
        return;
      }
      const destBlock = parseInt(destination.droppableId);
      const sourceBlock = parseInt(source.droppableId);

      if (destBlock !== sourceBlock) {
        const team = teams?.find((t) => t.getId() === draggableId);
        if (!team) return;

        await mutate({ teamId: team.getId(), destBlock });
        refetch();
      }
    },
    [mutate, refetch, teams]
  );

  return (
    <>
      {showError && (
        <ErrorModal
          onClose={() => setShowError(false)}
          text={`Het is niet mogelijk om dit team te verplaatsen. ${error}`}
        />
      )}
      <DragDropContext onDragEnd={onClick}>
        <div className="w-full">
          {[1, 2, 3].map((block) => (
            <Droppable key={block} droppableId={block.toString()}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <SessionGridHeader
                    block={block}
                    totalTeams={totalBlocks.get(block) ?? 0}
                    teams={blockTeams.get(block)?.get(boatType)?.length ?? 0}
                    boatType={boatType}
                    isFirst={block === 1}
                  />
                  {blockTeams
                    .get(block)
                    ?.get(boatType)
                    ?.map((team, index) => (
                      <Draggable
                        draggableId={team.getId()}
                        index={index}
                        key={team.getId()}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <SessionGridRow
                              team={team}
                              ageClasses={ageClasses}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </>
  );
}
