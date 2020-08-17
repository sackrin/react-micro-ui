import React from 'react';
import getMicroUIChild from "./getMicroUIChild";
import { MicroUIProps } from './Types/MicroUIProps';

export const MicroUIChild = (props: MicroUIProps) => getMicroUIChild(props);

export default MicroUIChild;
