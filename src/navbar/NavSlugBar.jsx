export default function NavSlugBar() {
  const { documentId, sceneId, shotId, takeId } = useCurrentCursor();
  const projectId = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.projectId,
  );
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const shotNumber = useShotNumber(documentId, sceneId, shotId);
  const takeNumber = useTakeNumber(documentId, shotId, takeId);
  return (
    <table className="bg-black text-white">
      <thead>
        <tr className="text-xs opacity-60">
          <th scope="col" className="w-[55%]">
            Project
          </th>
          <th scope="col" className="w-[15%]">
            Scene
          </th>
          <th scope="col" className="w-[15%]">
            Shot
          </th>
          <th scope="col" className="w-[15%]">
            Take
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="text-center">
          <td>
            <span className="inline-block w-[55vw] overflow-hidden overflow-ellipsis whitespace-nowrap">
              {projectId || '--'}
            </span>
          </td>
          <td>{formatSceneNumber(sceneNumber, false)}</td>
          <td>{formatShotNumber(shotNumber)}</td>
          <td>{formatTakeNumber(takeNumber)}</td>
        </tr>
      </tbody>
    </table>
  );
}
