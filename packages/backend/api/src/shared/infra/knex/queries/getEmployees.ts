const getEmployees = `
SELECT
  LTRIM(RTRIM(LOWER(RA_NOME))) name,
  RA_CIC cpf,
  LTRIM(RTRIM(LOWER(RA_EMAIL))) email,
  SUBSTRING(RD0_SENHA,4,1)+
  SUBSTRING(RD0_SENHA,1,1)+
  SUBSTRING(RD0_SENHA,5,1)+
  SUBSTRING(RD0_SENHA,2,1)+
  SUBSTRING(RD0_SENHA,6,1)+
  SUBSTRING(RD0_SENHA,3,1) password,
  'funcionario' type,
  LTRIM(RTRIM(LOWER(NOME))) company,
  LTRIM(RTRIM(LOWER(CTT_DESC01))) cost_center
FROM
  SRA010 SRA
  LEFT JOIN ZZZ_EMPRESAS ZZZ ON 
    FILIAL = RA_FILIAL
  LEFT JOIN CTT010 CTT ON 
    CTT.D_E_L_E_T_ = '' AND 
    CTT_FILIAL = RA_FILIAL AND 
    CTT_CUSTO = RA_CC
  LEFT JOIN RD0010 RD0 ON 
    RD0.D_E_L_E_T_ = '' AND 
    RD0_CIC = RA_CIC AND 
    RD0_DTADMI = RA_ADMISSA AND
    RD0_MSBLQL = 2
WHERE 
  SRA.D_E_L_E_T_ = '' AND
  RA_SITFOLH <> 'D'
ORDER BY
  company,
  name`

export default getEmployees