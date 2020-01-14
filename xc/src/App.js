import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import {Provider} from 'mobx-react'
import Loadable from 'react-loadable'
import InterceptRouter from './components/common/InterceptRouter'
import routes from './routes'
import stores from './stores'
import NoMatch from './pages/exception/404'
import './App.scss'

const LoadableFooter = Loadable({
  loader: () => import('./components/common/Footer'),
  loading() {
    return ''
  }
})

class App extends Component {

  componentDidMount() {
    const {localeStore} = stores;
    let lang = localStorage.getItem('LANG') || 'zh-cn';
    if (lang === 'zh-ch') {
      lang = 'zh-cn'
    }
    localeStore.switchLang(lang);
    document.title = 'X PLAN';
  }

  render() {
    const {...storesArray} = stores

    return (
      <Provider {...storesArray}>
        <div className="App">
          <Switch>
            {routes.map(route => {
              const ChildComponent = route.component
              return (
                <Route
                  key={route.name}
                  path={route.path}
                  exact
                  render={props => (
                    <InterceptRouter>
                      {<ChildComponent {...props} />}
                    </InterceptRouter>
                  )}
                />
              )
            })}
            <Route component={NoMatch}/>
          </Switch>
          <LoadableFooter/>
        </div>
      </Provider>
    )
  }
}

export default App
