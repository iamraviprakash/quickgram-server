import {
  adjectives,
  NumberDictionary,
  uniqueNamesGenerator,
} from 'unique-names-generator';

const numberDictionary = NumberDictionary.generate({
  min: 1000,
  max: 9999,
});

export const generateRoomCode = ({ size }) => {
  const roomCodeFullString = uniqueNamesGenerator({
    dictionaries: [numberDictionary, adjectives],
    separator: '',
    style: 'upperCase',
  });

  return roomCodeFullString.substring(0, size);
};
