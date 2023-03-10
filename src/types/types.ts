export type Department = {
    id: number
    title: string
    slug: string
    description: string
    created: Date
    updated: Date
}


// TODO Kennslumisseri má bara vera vor/sumar/haust
export type Course = {
    id: number,
    number: string,
    slug: string,
    title: string,
    credits: number,
    semester: 'Vor' | 'Sumar' | 'Haust' | 'Hálfsárs',
    level: string,
    url: string,
    departmentid: number
    created: Date,
    updated: Date,
  }

