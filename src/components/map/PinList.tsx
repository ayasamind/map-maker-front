import React, { useEffect, useState } from 'react';
import { useMapPins, useSetMapPins } from '@/hooks/MapPinsContext';
import styles from './PinList.module.css';
import { MarkerProps } from './Marker';

const PinForm: React.FC<{ pin: MarkerProps, idx: number }> = ({ pin, idx }) => {
  const setMapPins = useSetMapPins();
  
  // 個別にstate持っておかないと編集時にカーソルが荒ぶる
  const [title, setTitle] = useState(pin.title);
  useEffect(() => setTitle(pin.title), [pin.title]);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setTitle(e.target.value);
  }

  const onBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setMapPins((mapPins) => {
      const tailSlice = mapPins.splice(idx+1);
      const update: MarkerProps = {...mapPins.splice(idx, 1)[0], title: e.target.value};
      const headSlice = mapPins;
      return [...headSlice, update, ...tailSlice];
    });
  }

  return (<div>
    <div>({pin.coord.lat}, {pin.coord.lon})</div>
    <div><input type='text' value={title} onChange={onChange} onBlur={onBlur}></input></div>
  </div>)
} 

const PinList = () => {
  const mapPins = useMapPins();
  const [pinsDiv, setPinsDiv] = useState(<div></div>)

  useEffect(() => {
    const mapped = mapPins.map((pin, idx) => <PinForm pin={pin} idx={idx} key={idx} />);
    setPinsDiv(<div>{mapped}</div>);
  }, [mapPins]);

  return (
    <div className={styles.listContainer}>
      {pinsDiv}
    </div>
  )
}

export default PinList;
