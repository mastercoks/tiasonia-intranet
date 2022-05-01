import React from 'react'
import { Redirect, Switch, HashRouter } from 'react-router-dom'

import CollaboratorCards from '../pages/AccessControl/CollaboratorCards'
import CollaboratorList from '../pages/AccessControl/CollaboratorList'
import AccessControl from '../pages/AccessControl/Dashboard'
import Records from '../pages/AccessControl/Records'
import Reports from '../pages/AccessControl/Reports'
import Dashboard from '../pages/Dashboard'
import AddDocuments from '../pages/Envelopes/AddDocuments'
import AddRecipients from '../pages/Envelopes/AddRecipients'
import ContactConfirm from '../pages/Envelopes/ContactConfirm'
import ContactList from '../pages/Envelopes/ContactList'
import CreateEnvelope from '../pages/Envelopes/CreateEnvelope'
import EnvelopeList from '../pages/Envelopes/EnvelopeList'
import ShowEnvelope from '../pages/Envelopes/ShowEnvelope'
import Sign from '../pages/Envelopes/Sign'
import VerifyEnvelope from '../pages/Envelopes/VerifyEnvelope'
import PermissionList from '../pages/Settings/PermissionList'
import ReaderList from '../pages/Settings/ReaderList'
import ReaderTypeList from '../pages/Settings/ReaderTypeList'
import RoleList from '../pages/Settings/RoleList'
import UserList from '../pages/Settings/UserList'
import Signatures from '../pages/Signatures'
import SignIn from '../pages/SignIn'
import Conflicts from '../pages/Webservices/Conflicts'
import Route from './Route'

const Routes: React.FC = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" exact component={SignIn} />
        <Route isPrivate path="/dashboard" exact component={Dashboard} />
        <Route
          isPrivate
          path="/signatures"
          exact
          need={['SIGNATURES']}
          component={Signatures}
        />
        <Route
          isPrivate
          path="/envelopes"
          exact
          need={['ENVELOPES']}
          component={EnvelopeList}
        />
        <Route
          isPrivate
          path="/envelopes/contacts"
          exact
          need={['LIST_CONTACT']}
          component={ContactList}
        />
        <Route
          isPrivate
          path="/envelopes/create"
          exact
          need={['CREATE_ENVELOPE']}
          component={CreateEnvelope}
        />
        <Route
          isPrivate
          path="/envelopes/:id"
          exact
          need={['CREATE_ENVELOPE']}
          component={ShowEnvelope}
        />
        <Route
          isPrivate
          path="/envelopes/:id/documents"
          exact
          need={['CREATE_ENVELOPE']}
          component={AddDocuments}
        />
        <Route
          isPrivate
          path="/envelopes/:id/recipients"
          exact
          need={['CREATE_ENVELOPE']}
          component={AddRecipients}
        />
        <Route isPublic path="/esign/verify" exact component={VerifyEnvelope} />
        <Route isPublic path="/esign/:recipient_id" exact component={Sign} />
        <Route
          isPublic
          path="/esign/verify/:id"
          exact
          component={VerifyEnvelope}
        />
        <Route
          isPublic
          path="/esign/:email/:password"
          exact
          component={ContactConfirm}
        />
        <Route
          isPrivate
          path="/access-control"
          exact
          need={['ACCESS_CONTROL']}
          component={AccessControl}
        />
        <Route
          isPrivate
          path="/access-control/cards"
          exact
          need={['LIST_CARD']}
          component={Dashboard}
        />
        <Route
          isPrivate
          path="/access-control/records"
          exact
          need={['LIST_RECORD']}
          component={Records}
        />
        {/* <Route isPrivate path="/email-signature" exact component={Dashboard} />
      <Route isPrivate path="/reschedule-bills" exact component={Dashboard} /> */}
        <Route
          isPrivate
          path="/webservices"
          exact
          component={Dashboard}
          need={['WEBSERVICES']}
        />
        <Route
          isPrivate
          path="/webservices/conflicts"
          exact
          component={Conflicts}
          need={['LIST_CONFLICT']}
        />
        <Route
          isPrivate
          path="/access-control/collaborators"
          exact
          need={['LIST_USER']}
          component={CollaboratorList}
        />
        <Route
          isPrivate
          path="/access-control/collaborators/:id/cards"
          exact
          need={['LIST_CARD']}
          component={CollaboratorCards}
        />
        <Route
          isPrivate
          path="/access-control/reports"
          exact
          need={['LIST_CARD']}
          component={Reports}
        />
        <Route
          isPrivate
          path="/settings"
          exact
          component={Dashboard}
          need={['SETTINGS']}
        />
        <Route
          isPrivate
          path="/settings/users"
          exact
          need={['LIST_USER']}
          component={UserList}
        />
        <Route
          isPrivate
          path="/settings/roles"
          exact
          component={RoleList}
          need={['LIST_ROLE']}
        />
        <Route
          isPrivate
          path="/settings/permissions"
          exact
          component={PermissionList}
          need={['LIST_PERMISSION']}
        />
        <Route
          isPrivate
          path="/settings/readers"
          exact
          component={ReaderList}
          need={['LIST_READER']}
        />
        <Route
          isPrivate
          path="/settings/types"
          exact
          component={ReaderTypeList}
          need={['LIST_READER_TYPE']}
        />
        <Redirect to="/dashboard" />
      </Switch>
    </HashRouter>
  )
}

export default Routes
