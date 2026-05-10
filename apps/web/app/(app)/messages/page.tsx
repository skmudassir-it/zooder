export default function MessagesPage() {
  return (
    <div>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border">
        <h1 className="px-4 py-3 text-xl font-bold">Messages</h1>
      </div>
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg">💬</p>
        <p className="mt-2">Messages coming soon</p>
      </div>
    </div>
  );
}
