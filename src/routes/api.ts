import express, { Request, Response, NextFunction } from 'express';
import { query } from '../lib/db.js';
import {
  mapDbIndicesToIndices,
  indexMapper,
  mapDbIndexToIndex,
} from '../lib/events.js';

export const router = express.Router();

export async function index(req: Request, res: Response, next: NextFunction) {
  const eventsResult = await query('SELECT * FROM deild;');

  const events = mapDbIndicesToIndices(eventsResult);


  res.json(events);
}

export async function event(req: Request, res: Response, next: NextFunction) {
  const { slug } = req.params;
  const eventsResult = await query('SELECT * FROM events WHERE slug = $1;', [
    slug,
  ]);

  const event = mapDbIndexToIndex(eventsResult);

  if (!event) {
    return next();
  }

  res.json(event);
}

async function patchEvent() {}

async function createEvent(req: Request, res: Response, next: NextFunction) {
  const { title, slug, description } = req.body;

  res.json({ title, slug, description });
}

async function deleteEvent() {}

router.get('/', index);
router.get('/:slug', event);
router.patch('/:slug', patchEvent);
router.post('/', createEvent);
router.delete('/:slug', deleteEvent);
