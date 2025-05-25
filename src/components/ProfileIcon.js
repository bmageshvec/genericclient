import { useState, useEffect } from 'react';
import { getUserId } from '../utils/auth';

function ProfileIcon() {
  const [initial, setInitial] = useState('');

  useEffect(() => {
    const userId = getUserId();
    setInitial(userId ? userId.charAt(0).toUpperCase() : 'U');
  }, []);

  return <span className="profile-icon">{initial}</span>;
}

export default ProfileIcon;