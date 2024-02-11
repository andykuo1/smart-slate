import { useEffect, useState } from 'react';

import DarkModeIcon from '@material-symbols/svg-400/rounded/dark_mode.svg';
import LightModeIcon from '@material-symbols/svg-400/rounded/light_mode.svg';
import SystemPreferenceIcon from '@material-symbols/svg-400/rounded/settings_night_sight.svg';

import FieldButton from '@/fields/FieldButton';

/**
 * @param {object} props
 * @param {string} props.className
 */
export default function DarkModeToggle({ className }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme'));
  function onClick() {
    if (!theme) {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'dark') {
      setTheme('light');
      localStorage.setItem('theme', 'light');
    } else if (theme === 'light') {
      setTheme('');
      localStorage.removeItem('theme');
    }
  }
  useEffect(() => {
    // NOTE: https://tailwindcss.com/docs/dark-mode#supporting-system-preference-and-manual-selection
    if (
      theme === 'dark' ||
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  return (
    <FieldButton
      className={className}
      Icon={
        !localStorage.theme
          ? SystemPreferenceIcon
          : localStorage.theme !== 'dark'
            ? LightModeIcon
            : DarkModeIcon
      }
      onClick={onClick}
    />
  );
}
