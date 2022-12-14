const ProfilePicture = () => {
  return (
    <div className="h-[142px] w-[142px] bg-white rounded-full flex justify-center items-center">
      <div className="max-h-[132px] max-w-[132px] rounded-full overflow-hidden">
        <img
          src="https://media.lenster.xyz/tr:n-avatar,tr:di-placeholder.webp/https://lens.infura-ipfs.io/ipfs/bafkreifeoibbrqfdu7jefal6ypnlrkz3v6fadv63fjrdxog4gmxpmcyfny"
          loading="lazy"
          alt="strek.test"
        />
      </div>
    </div>
  );
};

export default ProfilePicture;
