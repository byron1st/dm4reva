import {expect} from 'chai'
import * as exdefDB from '../app/db/exdefDB.js'
import * as exdefData from './data/exdefDB.test.data.js'

describe('exdefDB', () => {
  beforeEach((done) => {
    exdefDB.deleteAll((num) => done())
  })

  it('#create one', (done) => {
    exdefDB.create(exdefData.anExdef1, (doc) => {
      expect(doc).to.not.be.null
      exdefDB.read({type:'Thread'}, {kind:1, type:1}, (docs) => {
        expect(docs).to.have.lengthOf(1)
        expect(docs[0].type).to.equal('Thread')
        done()
      })
    })
  })

  it('#create muti', (done) => {
    exdefDB.create([exdefData.anExdef1, exdefData.anExdef2], (docs) => {
      expect(docs).to.not.be.null
      expect(docs).to.have.lengthOf(2)
      exdefDB.read({kind:'EConnector'}, {kind:1, type:1}, (docs) => {
        expect(docs).to.have.lengthOf(1)
        expect(docs[0].type).to.equal('StreamIO')
        done()
      })
    })
  })

  it('#update', (done) => {
    exdefDB.create([exdefData.anExdef1], (doc) => {
      expect(doc).to.not.be.null
      expect(doc[0].inf).to.have.lengthOf(2)
      let updatedItem = exdefData.anExdef1Updated
      updatedItem._id = doc[0]._id
      exdefDB.update(updatedItem, () => {
        exdefDB.read({type:'Thread'}, {kind:1, type:1}, (docs) => {
          expect(docs).to.have.lengthOf(1)
          expect(docs[0].inf).to.have.lengthOf(1)
          done()
        })
      })
    })
  })

  it('#remove one', (done) => {
    exdefDB.create(exdefData.anExdef1, (doc) => {
      expect(doc).to.not.be.null
      exdefDB.deleteOne(doc._id, () => {
        exdefDB.read({type:'Thread'}, {kind:1, type:1}, (docs) => {
          expect(docs).to.be.empty
          done()
        })
      })
    })
  })
})
