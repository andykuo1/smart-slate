import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';
import { useCallback } from 'react';

import MoreVertIcon from '@material-symbols/svg-400/rounded/more_vert.svg';
import ThumbDownFillIcon from '@material-symbols/svg-400/rounded/thumb_down-fill.svg';
import ThumbDownIcon from '@material-symbols/svg-400/rounded/thumb_down.svg';
import ThumbUpFillIcon from '@material-symbols/svg-400/rounded/thumb_up-fill.svg';
import ThumbUpIcon from '@material-symbols/svg-400/rounded/thumb_up.svg';

import { useSetTakeRating, useTakeRating } from '@/stores/DocumentStoreContext';
import MenuStyle from '@/styles/Menu.module.css';

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').TakeId} props.takeId
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 * @param {boolean} [props.showButton]
 * @param {boolean} [props.disabled]
 */
export default function TakeOptions({
  documentId,
  takeId,
  className,
  children,
  showButton = true,
  disabled = false,
}) {
  return (
    <MenuProvider>
      <MenuButton
        className={'relative flex flex-row items-center' + ' ' + className}
        disabled={disabled}>
        {children}
        {showButton && <MoreVertIcon className="w-6 h-6" />}
      </MenuButton>
      <Menu className={MenuStyle.menu}>
        <TakeRatingMenuItem documentId={documentId} takeId={takeId} />
        <MenuItem className={MenuStyle.menuItem}>Upload</MenuItem>
        <MenuItem className={MenuStyle.menuItem}>Download</MenuItem>
        <MenuItem className={MenuStyle.menuItem}>Like</MenuItem>
        <MenuItem className={MenuStyle.menuItem}>Dislike</MenuItem>
      </Menu>
    </MenuProvider>
  );
}

/**
 * @param {object} props
 * @param {import('@/stores/DocumentStore').DocumentId} props.documentId
 * @param {import('@/stores/DocumentStore').TakeId} props.takeId
 */
function TakeRatingMenuItem({ documentId, takeId }) {
  const rating = useTakeRating(documentId, takeId);
  const setTakeRating = useSetTakeRating();

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

  const onBadClick = useCallback(
    function _onBadClick() {
      if (rating >= 0) {
        setTakeRating(documentId, takeId, -1);
      } else {
        setTakeRating(documentId, takeId, 0);
      }
    },
    [rating, documentId, takeId, setTakeRating],
  );

  const isGood = rating > 0;
  const isBad = rating < 0;
  return (
    <div className="flex flex-row items-center">
      <MenuItem
        className={MenuStyle.menuItem + ' ' + 'flex-1 flex flex-row'}
        onClick={onGoodClick}
        hideOnClick={false}>
        <span className="flex-1">
          {isGood ? 'Good :D' : isBad ? 'Bad :(' : 'Rate me'}
        </span>
        {isGood ? (
          <ThumbUpFillIcon className="w-6 h-6 fill-current" />
        ) : (
          <ThumbUpIcon
            className={'w-6 h-6 fill-current' + ' ' + (isBad && 'opacity-10')}
          />
        )}
      </MenuItem>
      <MenuItem
        className={MenuStyle.menuItem}
        onClick={onBadClick}
        hideOnClick={false}>
        {isBad ? (
          <ThumbDownFillIcon className="w-6 h-6 fill-current" />
        ) : (
          <ThumbDownIcon
            className={'w-6 h-6 fill-current' + ' ' + (isGood && 'opacity-10')}
          />
        )}
      </MenuItem>
    </div>
  );
}
