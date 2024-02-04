import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import QRCode2Icon from '@material-symbols/svg-400/rounded/qr_code_2.svg';

import FancyButton from '@/buttons/FancyButton';

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
      label={<span className="hidden sm:block">Have QR codes?</span>}
      className="absolute bottom-2 left-2"
      onClick={onClick}>
      <QRCode2Icon className="inline-block w-6 fill-current" />
    </FancyButton>
  );
}
