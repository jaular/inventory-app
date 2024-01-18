import { Badge } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

type Props = {
  value: boolean;
};

const Includes = ({ value }: Props) => {
  return (
    <>
      {value ? (
        <Badge size="lg" circle variant="light" color="teal">
          <IconCheck size={14} stroke={1.5} />
        </Badge>
      ) : (
        <Badge size="lg" circle variant="light" color="red">
          <IconX size={14} stroke={1.5} />
        </Badge>
      )}
    </>
  );
};

export default Includes;
