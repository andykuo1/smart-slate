import {
  Document,
  Image,
  PDFViewer,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import { Fragment } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { numToChar } from '@/components/takes/TakeNameFormat';
import { useSceneNumber } from '@/serdes/UseResolveSceneNumber';
import {
  findSceneWithShotId,
  getDocumentById,
  getDocumentSettingsById,
} from '@/stores/document';
import {
  useDocumentStore,
  useProjectId,
  useShotIdsInDocumentOrder,
  useShotIdsInSceneOrder,
} from '@/stores/document/use';
import { useCurrentDocumentId, useCurrentSceneId } from '@/stores/user';

export default function PDFBooth() {
  const currentSceneId = useCurrentSceneId();
  if (currentSceneId) {
    return <PDFStoryboardByScene />;
  } else {
    return <PDFStoryboardByDocument />;
  }
}

function PDFStoryboardByDocument() {
  const documentId = useCurrentDocumentId();
  const documentTitle = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.documentTitle,
  );
  const projectId = useProjectId(documentId);
  const writerName = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.writerName,
  );
  const shotIds = useShotIdsInDocumentOrder(documentId);
  const shotIdsPerPage = toSixPerChild(shotIds);
  const shots = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.shots,
  );
  const shotsPerPage = shotIdsPerPage.map((shotIds) =>
    shotIds.map((shotId) => shots[shotId]),
  );
  const titlesPerShot = useDocumentStore(
    useShallow((ctx) => {
      /** @type {Record<import('@/stores/document/DocumentStore').ShotId, string>} */
      let result = {};
      let document = getDocumentById(ctx, documentId);
      for (let shotId of shotIds) {
        let scene = findSceneWithShotId(ctx, documentId, shotId);
        let shot = document.shots[shotId];
        result[shotId] = `Scene ${scene?.sceneNumber} | Shot ${numToChar(
          shot?.shotNumber,
        )}`;
      }
      return result;
    }),
  );
  const headerPerPage = shotsPerPage.map(
    () => `${projectId}${writerName ? ' | ' + writerName : ''}`,
  );

  return (
    <PDFViewer className="h-full w-full">
      <PDFStoryboard
        title={documentTitle}
        headerPerPage={headerPerPage}
        shotsPerPage={shotsPerPage}
        titlesPerShot={titlesPerShot}
      />
    </PDFViewer>
  );
}

function PDFStoryboardByScene() {
  const documentId = useCurrentDocumentId();
  const sceneId = useCurrentSceneId();
  const documentTitle = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.documentTitle,
  );
  const projectId = useProjectId(documentId);
  const sceneNumber = useSceneNumber(documentId, sceneId);
  const writerName = useDocumentStore(
    (ctx) => getDocumentSettingsById(ctx, documentId)?.writerName,
  );
  const shotIds = useShotIdsInSceneOrder(documentId, sceneId);
  const shotIdsPerPage = toSixPerChild(shotIds);
  const shots = useDocumentStore(
    (ctx) => getDocumentById(ctx, documentId)?.shots,
  );
  const shotsPerPage = shotIdsPerPage.map((shotIds) =>
    shotIds.map((shotId) => shots[shotId]),
  );
  const titlesPerShot = useDocumentStore(
    useShallow((ctx) => {
      /** @type {Record<import('@/stores/document/DocumentStore').ShotId, string>} */
      let result = {};
      let document = getDocumentById(ctx, documentId);
      for (let shotId of shotIds) {
        let scene = findSceneWithShotId(ctx, documentId, shotId);
        let shot = document.shots[shotId];
        result[shotId] = `Scene ${scene?.sceneNumber} | Shot ${numToChar(
          shot?.shotNumber,
        )}`;
      }
      return result;
    }),
  );
  const headerPerPage = shotsPerPage.map(
    () =>
      `${projectId}${' | SCENE ' + sceneNumber}${
        writerName ? ' | ' + writerName : ''
      }`,
  );

  return (
    <PDFViewer className="h-full w-full">
      <PDFStoryboard
        title={`${documentTitle} - Scene ${sceneNumber}`}
        headerPerPage={headerPerPage}
        shotsPerPage={shotsPerPage}
        titlesPerShot={titlesPerShot}
      />
    </PDFViewer>
  );
}

const Styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: '0.5in',
    backgroundColor: '#EFEFEF',
  },
  header: {
    fontSize: 12,
    marginLeft: '0.5in',
    height: '0.5in',
  },
  headerView: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  mlAuto: {
    marginLeft: 'auto',
  },
  fontMd: {
    fontSize: 14,
  },
  opacityFaded: {
    opacity: 0.3,
  },
  gridItem: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  gridView: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  shotType: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: 10,
    fontSize: 14,
  },
  shotText: {
    fontSize: 14,
    fontFamily: 'Courier',
  },
  shotImage: {
    width: '100%',
    height: '47%',
    border: '1px solid black',
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginBottom: 10,
  },
});

/**
 * @param {object} props
 * @param {string} props.title
 * @param {Array<string>} props.headerPerPage
 * @param {Array<Array<import('@/stores/document/DocumentStore').Shot>>} props.shotsPerPage
 * @param {Record<import('@/stores/document/DocumentStore').ShotId, string>} props.titlesPerShot
 */
function PDFStoryboard({ title, headerPerPage, shotsPerPage, titlesPerShot }) {
  const dateString = new Date().toLocaleDateString();
  return (
    <Document title={title}>
      {shotsPerPage.map((shots, index, array) => (
        <Page
          key={`storyboard-page-${index}`}
          style={Styles.page}
          size="A4"
          orientation="landscape">
          <HeaderView style={Styles.header}>
            <Text>{headerPerPage[index]}</Text>
            <Text style={Styles.mlAuto}>
              <Text>{dateString} - </Text>
              Page {index + 1} of {array.length}
            </Text>
          </HeaderView>
          <GridView
            rows={2}
            cols={3}
            items={shots}
            style={Styles.gridItem}
            offsetIndex={0}
            placeholder={(key) => (
              <Fragment key={key}>
                <Text style={Styles.fontMd}>
                  {/* NOTE: a space to preserve height. */ ' '}
                </Text>
                <View style={Styles.shotImage} />
              </Fragment>
            )}>
            {(shot) => (
              <Fragment key={`storyboard-shot-${shot.shotId}`}>
                <Text style={Styles.fontMd}>
                  {titlesPerShot[shot.shotId] + ' '}
                  {shot.shotHash && (
                    <Text style={Styles.opacityFaded}>#{shot.shotHash}</Text>
                  )}
                </Text>
                <Text style={Styles.shotType}>{shot.shotType}</Text>
                {shot.referenceImage ? (
                  <Image
                    source={shot.referenceImage}
                    style={Styles.shotImage}
                  />
                ) : (
                  <View style={Styles.shotImage} />
                )}
                <Text style={Styles.shotText}>{shot.description}</Text>
              </Fragment>
            )}
          </GridView>
        </Page>
      ))}
    </Document>
  );
}

/**
 * @param {object} props
 * @param {import('@react-pdf/renderer').ViewProps['style']} [props.style]
 * @param {import('react').ReactNode} props.children
 */
function HeaderView({ style = {}, children }) {
  return <View style={[Styles.headerView, style].flat()}>{children}</View>;
}

/**
 * @template T
 * @param {object} props
 * @param {number} props.rows
 * @param {number} props.cols
 * @param {Array<T>} props.items
 * @param {import('@react-pdf/renderer').ViewProps['style']} [props.style]
 * @param {number} props.offsetIndex
 * @param {(item: T) => import('react').ReactNode} props.children
 * @param {(key: string) => import('react').ReactNode} props.placeholder
 */
function GridView({
  rows,
  cols,
  items,
  style = {},
  offsetIndex,
  children,
  placeholder,
}) {
  let result = [];
  for (let j = 0; j < rows; ++j) {
    let row = [];
    for (let i = 0; i < cols; ++i) {
      let index = i + j * cols + offsetIndex;
      if (index < items.length) {
        row.push(items[index]);
      } else {
        row.push(null);
      }
    }
    result.push(row);
  }
  return (
    <View style={Styles.gridView}>
      {result.map((row, index) => (
        <View
          key={`storyboard-grid-row-${index}`}
          style={{
            flexDirection: 'row',
            flexGrow: 1,
            height: `${Math.trunc(100 / rows)}%`,
          }}>
          {row.map((item, index) => (
            <View
              key={`storyboard-grid-item-${index}`}
              style={{
                flexGrow: 1,
                flexDirection: 'column',
                margin: '0.1in',
                width: `${Math.trunc(100 / cols)}%`,
                ...style,
              }}>
              {item
                ? children(item)
                : placeholder(`storyboard-grid-placeholder-${index}`)}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

/**
 * @param {Array<string>} array
 */
function toSixPerChild(array) {
  let result = [];
  let i;
  for (i = 0; i < array.length; i += 6) {
    let item = array.slice(i, i + 6);
    result.push(item);
  }
  if (i < array.length) {
    result.push(array.slice(i));
  }
  return result;
}
