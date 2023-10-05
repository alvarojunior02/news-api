import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import New from 'App/Models/New'

export default class NewsController {
  public async index({ response }: HttpContextContract) {
    const news = await New.query().select('*').orderBy('created_at', 'desc')

    return response.status(200).json({
      data: news,
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const newNewsSchema = schema.create({
      title: schema.string(),
      content: schema.string(),
    })

    const { title, content } = await request.validate({
      schema: newNewsSchema,
      messages: {
        'title.string': 'Title invalid!',
        'content.string': 'Content invalid!',
      },
    })

    const news = await New.create({
      title: title,
      content: content,
    })

    return response.status(201).json({
      news: news,
    })
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const news = await New.find(id)

    if (news) {
      return response.status(200).json({
        news: news,
      })
    } else {
      return response.status(404).json({
        error: 'News not found!',
      })
    }
  }

  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const news = await New.find(id)

    if (news) {
      const newNewsSchema = schema.create({
        title: schema.string(),
        content: schema.string(),
      })

      const { title, content } = await request.validate({
        schema: newNewsSchema,
        messages: {
          'title.string': 'Title invalid!',
          'content.string': 'Content invalid!',
        },
      })

      news.title = title
      news.content = content
      await news.save()

      return response.status(200).json({
        news: news,
      })
    } else {
      return response.status(404).json({
        error: 'News not found!',
      })
    }
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const news = await New.find(id)

    if (news) {
      await news.softDelete(news)

      return response.status(200).json({
        message: 'News deleted!',
      })
    } else {
      return response.status(404).json({
        error: 'News not found!',
      })
    }
  }
}
