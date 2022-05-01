const getCustomers = `
SELECT
	LTRIM(RTRIM(A1_COD))+'-'+LTRIM(RTRIM(A1_LOJA)) code,
	LTRIM(RTRIM(LOWER(A1_NOME))) name,
	LTRIM(RTRIM(A1_CGC)) cnpj,
	LTRIM(RTRIM(B.A3_COD)) code_salesman,
	LTRIM(RTRIM(LOWER(B.A3_NOME))) name_salesman,
	LTRIM(RTRIM(C.A3_COD)) code_coordinator,
	LTRIM(RTRIM(LOWER(C.A3_NOME))) name_coordinator,
	CASE A1_GRPTRIB
		WHEN '001' THEN 1
		ELSE 0
	END simple_national
FROM
	SA1010 A,
	SA3010 B,
	SA3010 C
WHERE 
	A.D_E_L_E_T_ = ''
	AND B.D_E_L_E_T_ = ''
	AND C.D_E_L_E_T_ = ''
	AND A1_VEND = B.A3_COD
	AND B.A3_SUPER = C.A3_COD
	AND A1_MSBLQL = 2
	AND A1_INSCR <> ''
	AND A1_EST = 'BA'
	AND A1_INSCR <> 'ISENTO'
	AND A1_PESSOA = 'J'
ORDER BY 
	name`

export default getCustomers
