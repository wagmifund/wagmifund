import { useState} from 'react'
import clsx from 'clsx'
const ProfilePicture = () => {
  const [loading, setLoading] = useState(true)
  return (
    <div className={clsx(' h-[142px] w-[142px] rounded-full flex justify-center items-center', loading ? "animate-pulse bg-slate-600" : "bg-white")}>
      <div className="max-h-[132px] max-w-[132px] rounded-full overflow-hidden">
        <img
          src="https://media.lenster.xyz/tr:n-avatar,tr:di-placeholder.webp/https://lens.infura-ipfs.io/ipfs/bafkreifeoibbrqfdu7jefal6ypnlrkz3v6fadv63fjrdxog4gmxpmcyfny"
          loading="lazy"
          className={clsx({'h-0 opacity-0': loading} )}
          onLoad={() => setLoading(false)}
          alt="strek.test"
        />
      </div>
    </div>
  );
};

export default ProfilePicture;
