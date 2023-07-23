// import { Card, Text } from "@nextui-org/react";

export interface Pin {
  name: string;
  description: string;
}

export default function PinItem(pin: Pin){
  return (
    <div></div>
    // <Card isHoverable css={{mw: "400px"}}>
    //   <Card.Body>
    //     <Text h6 size={15}>
    //       {pin.name}
    //     </Text>
    //   </Card.Body>
    // </Card>
  );
};
