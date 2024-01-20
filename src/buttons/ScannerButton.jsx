import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import QRCode2Icon from '@material-symbols/svg-400/rounded/qr_code_2.svg';

import FancyButton from '@/libs/FancyButton';

export default function ScannerButton() {
  const navigate = useNavigate();
  const onClick = useCallback(
    function _onClick() {
      navigate('/scan');
    },
    [navigate],
  );

  return (
    <FancyButton
      title="Have QR codes?"
      className="absolute bottom-2 left-2 mx-1 px-12 hidden sm:block"
      onClick={onClick}>
      <QRCode2Icon className="inline-block w-6 fill-current" />
    </FancyButton>
  );
}
