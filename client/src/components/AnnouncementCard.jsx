import {
  Megaphone,
  CalendarDays
} from "lucide-react";

const AnnouncementCard = ({ announcement }) => {
  const date = new Date(
    announcement.createdAt
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  return (
    <div className="announcement-card">
      <div className="announcement-icon">
        <Megaphone size={20} />
      </div>

      <div className="announcement-content">
        <div className="announcement-top">
          <h3>{announcement.title}</h3>

          <span className="announcement-date">
            <CalendarDays size={14} />
            {date}
          </span>
        </div>

        <p>{announcement.content}</p>

        {announcement.createdBy && (
          <span className="announcement-author">
            Posted by {announcement.createdBy.name}
          </span>
        )}
      </div>
    </div>
  );
};

export default AnnouncementCard;