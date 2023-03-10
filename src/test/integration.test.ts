import { describe, expect, test } from '@jest/globals';
import { deleteAndParse, fetchAndParse, patchAndParse, postAndParse } from './utils';

import dotenv from 'dotenv';
dotenv.config({ path: './.env.test' });


describe('integration', () => {
    beforeAll(async () => {
        const department = {
            title: 'Placeholder',
            description: 'placeholder department til að testa fetch'
        }
        return await postAndParse('/departments', department)
    
    })
    
    afterAll(async () => {
        return await deleteAndParse('/departments/placeholder', null)
    
    })

    test('GET /departments returns 200',async () => {
        const result = await fetchAndParse('/departments')
        expect(result.status).toBe(200)
    })

    test('POST /department returns 201 and gets it by id', async () => {

        const department = {
            title: "Testdeild",
            description: "Deild til að testa virkni",
        }
  
        const { result, status } = await postAndParse('/departments', department);
        expect(status).toBe(201);
        expect(result.title).toBe('Testdeild');
        expect(result.id).toBeTruthy()
      });

      test('GET /departments/testdeild returns 200', async () => {
        const result = await fetchAndParse('/departments/')
        expect(result.status).toBe(200)
      })

      test('PATCH /departments/testdeild returns 200 and description is update', async () => {
        const newLysing = {
            lysing: 'updatedLysing'
        }
        const result = await patchAndParse('/departments/placeholder', newLysing)
        expect(result.status).toBe(200)
      })
      

      test('DELETE /departments/testdeild returns 204', async () => {
        const result = await deleteAndParse('/departments/testdeild', null)
        expect(result.status).toBe(204)
      })
  
})

