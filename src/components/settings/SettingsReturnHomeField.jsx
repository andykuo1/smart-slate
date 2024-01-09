import { useNavigate } from 'react-router-dom';

import BackIcon from '@material-symbols/svg-400/rounded/arrow_back.svg';

export default function SettingsReturnHomeField() {
  const navigate = useNavigate();
  function onClick() {
    navigate('/');
  }
  return (
    <button
      className="text-sm items-center flex text-blue-500 hover:underline cursor-pointer"
      onClick={onClick}>
      <BackIcon className="inline-block w-6 h-6 fill-current pointer-events-none" />
      Not the project you are looking for?
    </button>
  );
}
