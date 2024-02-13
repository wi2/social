export default function BubbleChat({
  user,
  content,
  time,
}: {
  user: any;
  content: string;
  time: any;
}) {
  return (
    <div className="chat chat-start p-4">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">{user}</div>
      </div>
      <div className="chat-header">{user}</div>
      <div className="chat-bubble">{content}</div>
      <div className="chat-footer">
        <time className="text-xs opacity-50">{time}</time>
      </div>
    </div>
  );
}
