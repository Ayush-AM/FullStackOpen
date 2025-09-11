import { Gender } from '../types';

interface GenderIconProps {
  gender: Gender;
}

const GenderIcon = ({ gender }: GenderIconProps) => {
  switch (gender) {
    case Gender.Male:
      return <span>♂</span>;
    case Gender.Female:
      return <span>♀</span>;
    case Gender.Other:
      return <span>⚧</span>;
    default:
      return <span>?</span>;
  }
};

export default GenderIcon;