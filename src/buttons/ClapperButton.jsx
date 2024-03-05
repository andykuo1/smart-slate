import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import MovieIcon from '@material-symbols/svg-400/rounded/movie.svg';

import FancyButton from '@/buttons/FancyButton';

export default function ClapperButton() {
  const navigate = useNavigate();
  const onClick = useCallback(
    function _onClick() {
      navigate('/clap');
    },
    [navigate],
  );

  return (
    <FancyButton
      title="Ready to clap?"
      label={<span className="hidden sm:block">Ready to clap?</span>}
      onClick={onClick}>
      <MovieIcon className="inline-block w-6 fill-current" />
    </FancyButton>
  );
}
