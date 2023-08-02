import {getRowDataPacket, getRowDataPackets} from './CounterRepository.types';

describe('CounterRepository:Types', () => {
  it('constructs a RowDataPacket with data', () => {
    const result = getRowDataPacket<{data: string}>({data: 'sampleData'});
    expect(result).toEqual({
      constructor: {name: 'RowDataPacket'},
      data: 'sampleData',
    });
  });

  describe('getRowDataPackets', () => {
    it('constructs an array of RowDataPacket with data', () => {
      const result = getRowDataPackets<{data: string}>([
        {data: 'sampleData1'},
        {data: 'sampleData2'},
      ]);

      const expectedResult = [
        {
          constructor: {name: 'RowDataPacket'},
          data: 'sampleData1',
        },
        {
          constructor: {name: 'RowDataPacket'},
          data: 'sampleData2',
        },
      ];

      expect(result[0]).toEqual(expectedResult[0]);
      expect(result[1]).toEqual(expectedResult[1]);
    });

    it('accepts empty arrays', () => {
      const result = getRowDataPackets<{data: string}>([]);

      expect(result).toEqual([]);
    });
  });
});
