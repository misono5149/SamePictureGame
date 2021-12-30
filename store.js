import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const START_GAME = 'START_GAME';
export const OPEN_CELL = 'OPEN_CELL';
export const CLICK_MINE = 'CLICK_MINE';
export const NORMALIZE_CELL = 'NORMALIZE_CELL';
export const INCREMENT_TIMER = 'INCREMENT_TIMER';

export const CODE = {
  MINE: -7,
  NORMAL: -1,
  QUESTION: -2,
  FLAG_MINE: -5,
  CLICKED_MINE: -6,
  OPENED: 0, // 0 이상이면 다 opened
};
var cards;

const setCards = (row, cell) => {
  console.log(row, cell);
  cards [ require('../같은그림찾기/asset/apeach.png'), require('../같은그림찾기/asset/apeach.png'),
    require('../같은그림찾기/asset/con.png'), require('../같은그림찾기/asset/con.png'),
    require('../같은그림찾기/asset/frodo.png'),require('../같은그림찾기/asset/frodo.png'),
    require('../같은그림찾기/asset/jayz.png'), require('../같은그림찾기/asset/jayz.png'),
    require('../같은그림찾기/asset/lion.png'), require('../같은그림찾기/asset/lion.png'),
    require('../같은그림찾기/asset/muzi.png'),require('../같은그림찾기/asset/muzi.png'),
    require('../같은그림찾기/asset/neo.png'),require('../같은그림찾기/asset/neo.png'),
    require('../같은그림찾기/asset/tube.png'), require('../같은그림찾기/asset/tube.png')
  ];

  console.log(cards);
  return data;
};

export default new Vuex.Store({ // import store from './store';
  state: {
    tableData: [],
    data: {
      row: 0,
      cell: 0,
      mine: 0,
    },
    timer: 0,
    halted: true, // 중단된
    result: '',
    openedCount: 0,
  }, // vue의 data와 비슷
  getters: {

  }, // vue의 computed와 비슷
  mutations: {
    [START_GAME](state, { row, cell }) {
      state.data = {
        row,
        cell,
      };
      state.tableData = setCards(row, cell);
      state.timer = 0;
      state.halted = false;
      state.openedCount = 0;
      state.result = '';
    },
    [OPEN_CELL](state, { row, cell }) {
      let openedCount = 0;
      const checked = [];
      function checkAround(row, cell) { // 주변 8칸 지뢰인지 검색
        const checkRowOrCellIsUndefined = row < 0 || row >= state.tableData.length || cell < 0 || cell >= state.tableData[0].length;
        if (checkRowOrCellIsUndefined) {
          return;
        }
        if ([CODE.OPENED, CODE.FLAG, CODE.FLAG_MINE, CODE.QUESTION_MINE, CODE.QUESTION].includes(state.tableData[row][cell])) {
          return;
        }
        if (checked.includes(row + '/' + cell)) {
          return;
        } else {
          checked.push(row + '/' + cell);
        }
        let around = [];
        if (state.tableData[row - 1]) {
          around = around.concat([
            state.tableData[row - 1][cell - 1], state.tableData[row - 1][cell], state.tableData[row - 1][cell + 1]
          ]);
        }
        around = around.concat([
          state.tableData[row][cell - 1], state.tableData[row][cell + 1]
        ]);
        if (state.tableData[row + 1]) {
          around = around.concat([
            state.tableData[row + 1][cell - 1], state.tableData[row + 1][cell], state.tableData[row + 1][cell + 1]
          ]);
        }
        const counted = around.filter(function(v) {
          return [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v);
        });
        if (counted.length === 0 && row > -1) { // 주변칸에 지뢰가 하나도 없으면
          const near = [];
          if (row - 1 > -1) {
            near.push([row - 1, cell - 1]);
            near.push([row - 1, cell]);
            near.push([row - 1, cell + 1]);
          }
          near.push([row, cell - 1]);
          near.push([row, cell + 1]);
          if (row + 1 < state.tableData.length) {
            near.push([row + 1, cell - 1]);
            near.push([row + 1, cell]);
            near.push([row + 1, cell + 1]);
          }
          near.forEach((n) => {
            if (state.tableData[n[0]][n[1]] !== CODE.OPENED) {
              checkAround(n[0], n[1]);
            }
          });
        }
        if (state.tableData[row][cell] === CODE.NORMAL) {
          openedCount += 1;
        }
        Vue.set(state.tableData[row], cell, counted.length);
      }
      checkAround(row, cell);
      let halted = false;
      let result = '';
      if (state.data.row * state.data.cell - state.data.mine === state.openedCount + openedCount) {
        halted = true;
        result = `${state.timer}초만에 승리하셨습니다.`;
      }
      state.openedCount += openedCount;
      state.halted = halted;
      state.result = result;
    },
    [CLICK_MINE](state, { row, cell }) {
      state.halted = true;
      Vue.set(state.tableData[row], cell, CODE.CLICKED_MINE);
    },


    [NORMALIZE_CELL](state, { row, cell }) {
      if (state.tableData[row][cell] === CODE.QUESTION_MINE) {
        Vue.set(state.tableData[row], cell, CODE.MINE);
      } else {
        Vue.set(state.tableData[row], cell, CODE.NORMAL);
      }
    },
    [INCREMENT_TIMER](state) {
      state.timer += 1;
    },
  }, // state를 수정할 때 사용해요. 동기적으로
});