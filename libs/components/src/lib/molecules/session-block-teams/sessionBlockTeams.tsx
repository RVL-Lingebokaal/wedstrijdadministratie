'use client';
import { BoatType, Team, WedstrijdIdProps } from '@models';
import {
  ErrorModal,
  SessionGridHeader,
  SessionGridRow,
} from '@components/server';
import { useCallback, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { useUpdateBlockTeam, useUpdatePlaceTeam } from '@hooks';

interface SessionBlockTeamsProps extends WedstrijdIdProps {
  teams?: Team[];
  refetch: () => void;
  totalBlocks: Map<number, number>;
  blockTeams: Map<number, Map<string, Team[]>>;
  blockKey: string;
  boatType: BoatType;
}

export function SessionBlockTeams({
  teams,
  refetch,
  blockTeams,
  totalBlocks,
  blockKey,
  boatType,
  wedstrijdId,
}: SessionBlockTeamsProps) {
  const [showError, setShowError] = useState(false);
  const { mutate: updateBlock, error } = useUpdateBlockTeam({
    onError: () => setShowError(true),
    wedstrijdId,
  });
  const { mutate: updatePlace } = useUpdatePlaceTeam({ wedstrijdId });

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
        const team = teams?.find((t) => t.id === draggableId);
        if (!team) return;

        updateBlock({ teamId: team.id, destBlock });
      } else {
        const selectedBlock = blockTeams.get(destBlock);

        if (!selectedBlock) return;

        const selectedTeams = selectedBlock.get(blockKey);
        if (!selectedTeams) return;

        const [removed] = selectedTeams.splice(source.index, 1);
        selectedTeams.splice(destination.index, 0, removed);
        const teamsWithPlace = selectedTeams.map((t) => t.id);
        selectedBlock.set(blockKey, selectedTeams);
        blockTeams.set(destBlock, selectedBlock);

        updatePlace({ teamsWithPlace });
      }

      refetch();
    },
    [refetch, teams, updateBlock, blockTeams, blockKey, updatePlace]
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
                    teams={blockTeams.get(block)?.get(blockKey)?.length ?? 0}
                    boatType={boatType}
                    isFirst={block === 1}
                  />
                  {blockTeams
                    .get(block)
                    ?.get(blockKey)
                    ?.map((team, index) => (
                      <Draggable
                        draggableId={team.id}
                        index={index}
                        key={team.id}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <SessionGridRow team={team} />
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
