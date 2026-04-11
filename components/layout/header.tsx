export default function Header() {
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
            <div className="text-lg font-semibold">Dashboard</div>

            <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">Hi, Admin</div>

                <div className="w-8 h-8 bg-purple-500 text-white flex items-center justify-center rounded-full">
                    A
                </div>
            </div>
        </header>
    );
}