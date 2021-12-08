import pandas as pd
import numpy as np
#req xlrd

df = pd.read_excel('Education.xls', header=4)
index_columns = ['fips', 'state', 'area_name']
df.columns = index_columns + df.columns[3:].tolist()
df = df.drop([i for i in df.columns if 'rural-urban' in i.lower() or 'urban influence' in i.lower()], axis=1)
columns_to_drop = [i for i in df.columns if not (
                                     ( 'percent' in i.lower() )
                                     or (i in index_columns)
                                  )
    ]
df = df.drop(columns_to_drop, axis=1)

df = df.set_index(index_columns)

column_map = {"Percent of adults with less than a high school diploma": "noHighSchool",
"Percent of adults with a high school diploma only": 'highSchool',
"Percent of adults completing some college or associate's degree": 'someCollege',
"Percent of adults completing some college (1-3 years)":'someCollege',
"Percent of adults with a bachelor's degree or higher": 'bachelorsOrHigher',
"Percent of adults completing four years of college or higher":'bachelorsOrHigher'}

col_index_names = ['education','year']

columns = []
for i in df.columns:
    education, year = i.split(', ')
    education = column_map[education]
    columns.append([education, year])

df.columns = pd.MultiIndex.from_tuples(columns, names=col_index_names)

df = df.transpose().unstack('year').transpose().reset_index()

df = df.set_index(index_columns + ['year'])

#df = df.melt(value_vars=['highSchool','noHighSchool','someCollege','bachelorsOrHigher'], value_name='percent', ignore_index=False)

years = pd.unique(df.index.get_level_values('year'))

for year in years:
    df.loc[:,:,:, year].reset_index().drop('year',axis=1).transpose().to_json('education' + year + '.json')
    #df.loc[:,:,:, year].reset_index().drop('year',axis=1).transpose().to_json('education' + year + '.json')


#df_new = df[['FIPS Code', 'State', 'Area name'] + [i for i in df.columns if ('')]]
#		"fips": 27083,
#		"state": "MN",
#		"area_name": "Lyon County",
#		"bachelorsOrHigher": 27.2

