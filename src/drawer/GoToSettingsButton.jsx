import { useLocation, useNavigate } from 'react-router-dom';

import SettingsIcon from '@material-symbols/svg-400/rounded/tune.svg';

import FieldButton from '@/fields/FieldButton';

/**
 * @param {object} props
 * @param {string} props.className
 */
export default function GoToSettingsButton({ className }) {
  const navigate = useNavigate();
  const location = useLocation();

  function onSettingsClick() {
    if (!location.pathname.includes('/settings')) {
      navigate('/settings');
    }
  }
  return (
    <FieldButton
      className={className}
      Icon={SettingsIcon}
      onClick={onSettingsClick}
    />
  );
}
