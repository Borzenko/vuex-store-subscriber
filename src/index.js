import uuid4 from 'uuid/v4'

const storeSubscribe = {}

storeSubscribe.install = function (Vue, store) {
  let subscriptions = []
  Vue.prototype.$storeSubscribe = {
    subscribe: function(type, callback) {
      const subscription = new Subscription({
        id: uuid4(), type, callback
      })
      subscriptions.push(subscription)
      return subscription
    },

    unsubscribe: function(...unsubscribeList) {
      subscriptions = subscriptions.filter(sub => {
        return !!unsubscribeList.find(unsub => unsub.id === sub.id)
      })
    }
  }

  store.subscribe((mutation, changes) => {
    const subs = subscriptions.filter(sub => sub.type === mutation.type)
    subs.forEach(sub => {
      sub.callback(changes)
    })
  })
}

class Subscription {
  constructor({ id, type, callback }) {
    this.id = id
    this.type = type
    this.callback = callback
  }
}

export default storeSubscribe
