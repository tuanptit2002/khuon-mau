import * as urlSlug from 'url-slug';

export const getSlug = (value) => {
  const url = urlSlug.convert(value, {
    separator: '-',
    transformer: urlSlug.LOWERCASE_TRANSFORMER,
    dictionary: { 'đ': 'd', 'Đ': 'd' }
  });
  return url;
};