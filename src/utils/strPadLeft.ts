const str_pad_left = (string: number, pad: string, length: number) => {
  return (new Array(length + 1).join(pad) + string).slice(-length);
};

export default str_pad_left;
