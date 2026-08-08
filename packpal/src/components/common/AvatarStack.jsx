export default function AvatarStack({ users }) {
    return (
        <div className="flex">
            {users.map((user, idx) => (
                <div
                    key={idx}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-sm font-bold -ml-1 first:ml-0"
                    style={{ zIndex: users.length - idx }}
                >
                    {user.initials}
                </div>
            ))}
        </div>
    );
}