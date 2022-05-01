import React from 'react'
import { BiBuildings, BiIdCard } from 'react-icons/bi'

import Tabs from '../../components/Tabs'
import CompanyList from './CompanyList'
import SignaturesList from './SignatureList'
import { Container } from './styles'

const Signatures: React.FC = () => {
  return (
    <Container>
      <Tabs
        tabs={[
          {
            name: 'Assinaturas',
            icon: BiIdCard,
            children: <SignaturesList />
          },
          {
            name: 'Empresas',
            icon: BiBuildings,
            children: <CompanyList />
          }
        ]}
      />
    </Container>
  )
}

export default Signatures
