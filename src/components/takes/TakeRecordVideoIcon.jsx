import VideoFileIcon from '@material-symbols/svg-400/rounded/video_file.svg';

/**
 * @param {object} props
 * @param {string} [props.className]
 */
export default function TakeRecordVideoIcon({ className }) {
  return (
    <div className={'flex flex-row' + ' ' + className}>
      <VideoFileIcon className="fill-gray-300 ml-auto" />
      <span className="text-4xl text-red-400 disabled:text-gray-300 my-auto mr-auto">
        ◉
      </span>
    </div>
  );
}
