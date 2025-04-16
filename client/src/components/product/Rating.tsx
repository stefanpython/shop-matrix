import { Star, StarHalf } from "lucide-react";

interface RatingProps {
  value: number;
  text?: string;
  color?: string;
}

const Rating: React.FC<RatingProps> = ({
  value,
  text,
  color = "text-yellow-400",
}) => {
  return (
    <div className="flex items-center">
      <span className={color}>
        {value >= 1 ? (
          <Star className="fill-current" />
        ) : value >= 0.5 ? (
          <StarHalf className="fill-current" />
        ) : (
          <Star />
        )}
      </span>

      <span className={color}>
        {value >= 2 ? (
          <Star className="fill-current" />
        ) : value >= 1.5 ? (
          <StarHalf className="fill-current" />
        ) : (
          <Star />
        )}
      </span>

      <span className={color}>
        {value >= 3 ? (
          <Star className="fill-current" />
        ) : value >= 2.5 ? (
          <StarHalf className="fill-current" />
        ) : (
          <Star />
        )}
      </span>

      <span className={color}>
        {value >= 4 ? (
          <Star className="fill-current" />
        ) : value >= 3.5 ? (
          <StarHalf className="fill-current" />
        ) : (
          <Star />
        )}
      </span>

      <span className={color}>
        {value >= 5 ? (
          <Star className="fill-current" />
        ) : value >= 4.5 ? (
          <StarHalf className="fill-current" />
        ) : (
          <Star />
        )}
      </span>

      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
    </div>
  );
};

export default Rating;
