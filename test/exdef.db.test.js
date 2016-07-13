// import {expect} from 'chai'
// import * as exdefDB from '../dist/exdef.db.js'
// import * as exdefData from './resources/exdef.db.test.data.js'
//
// function createOneData () {
//   return new Promise((resolve, reject) => {
//     exdefDB.create(exdefData.anExdef1, (err, doc) => {
//       if (err) return reject()
//       expect(doc).to.not.be.null
//       expect(doc.inf).to.have.lengthOf(2)
//       return resolve(doc)
//     })
//   })
// }
//
// describe('exdefDB', () => {
//   beforeEach((done) => {
//     exdefDB.deleteAll((num) => done())
//   })
//
//   it('#create one', (done) => {
//     createOneData().then((createdDoc) => {
//       exdefDB.read({type:'Thread'}, {kind:1, type:1}, (docs) => {
//         expect(docs).to.have.lengthOf(1)
//         expect(docs[0].type).to.equal('Thread')
//         done()
//       })
//     })
//   })
//
//   it('#create muti', (done) => {
//     exdefDB.create([exdefData.anExdef1, exdefData.anExdef2], (err, docs) => {
//       expect(err).to.not.exist
//       expect(docs).to.not.be.null
//       expect(docs).to.have.lengthOf(2)
//       exdefDB.read({kind:'EConnector'}, {kind:1, type:1}, (docs) => {
//         expect(docs).to.have.lengthOf(1)
//         expect(docs[0].type).to.equal('StreamIO')
//         done()
//       })
//     })
//   })
//
//   it('#update', (done) => {
//     createOneData().then((createdDoc) => {
//       let updatedItem = exdefData.anExdef1Updated
//       updatedItem._id = createdDoc._id
//       exdefDB.update(updatedItem, (err) => {
//         if (err) Promise.reject(err)
//         Promise.resolve()
//       })
//     }).then(() => {
//       exdefDB.read({type:'Thread'}, {kind:1, type:1}, (docs) => {
//         expect(docs).to.have.lengthOf(1)
//         expect(docs[0].inf).to.have.lengthOf(1)
//         done()
//       })
//     }).catch((err) => console.log(err))
//   })
//
//   it('#remove one', (done) => {
//     createOneData().then((createdDoc) => {
//       exdefDB.deleteOne(createdDoc._id, (err) => {
//         if (err) Promise.reject(err)
//         Promise.resolve()
//       })
//     }).then(() => {
//       exdefDB.read({type:'Thread'}, {kind:1, type:1}, (docs) => {
//         expect(docs).to.be.empty
//         done()
//       })
//     }).catch((err) => console.log(err))
//   })
// })
