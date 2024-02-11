import { MenuItem } from '@ariakit/react';
import { useCallback } from 'react';

import ThumbUpFillIcon from '@material-symbols/svg-400/rounded/thumb_up-fill.svg';
import ThumbUpIcon from '@material-symbols/svg-400/rounded/thumb_up.svg';

import { useTakeNumber } from '@/serdes/UseResolveTakeNumber';
import { useSetTakeRating, useTakeRating } from '@/stores/document';
import { useShotTakeCount } from '@/stores/document/use';
import MenuStyle from '@/styles/Menu.module.css';

/**
 * @param {object} props
 * @param {import('@/stores/document/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/document/DocumentStore').ShotId} props.shotId
 * @param {import('@/stores/document/DocumentStore').TakeId} props.takeId
 */
export default function TakeRatingMenuItem({ documentId, shotId, takeId }) {
  const rating = useTakeRating(documentId, takeId);
  const setTakeRating = useSetTakeRating();

  const shotTakeCount = useShotTakeCount(documentId, shotId);
  const takeNumber = useTakeNumber(documentId, shotId, takeId);

  const onGoodClick = useCallback(
    function _onGoodClick() {
      if (rating <= 0) {
        setTakeRating(documentId, takeId, 1);
      } else {
        setTakeRating(documentId, takeId, 0);
      }
    },
    [rating, documentId, takeId, setTakeRating],
  );

  const isGood = rating > 0;
  return (
    <div className="flex flex-row items-center">
      <MenuItem
        className={MenuStyle.menuItem + ' ' + 'flex flex-1 flex-row'}
        onClick={onGoodClick}
        hideOnClick={false}>
        <span>Take</span>
        <output className="flex-1 font-mono">
          #{takeNumber}/{shotTakeCount}
        </output>
        {isGood ? (
          <ThumbUpFillIcon className="h-6 w-6 fill-current" />
        ) : (
          <ThumbUpIcon className="h-6 w-6 fill-current" />
        )}
      </MenuItem>
    </div>
  );
}
