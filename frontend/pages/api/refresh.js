import nookies from 'nookies'
import { httpClient } from '../../src/infra/httpClient/httpClient';
import { tokenService } from '../../src/services/auth/tokenService';

const REFRESH_TOKEN_KEY = 'refresh_token_key';

const controllers = {
  async storeRefreshToken(req, res) {
    //console.log(req.body.refresh_token);
    const context = { req, res }
    nookies.set(context, REFRESH_TOKEN_KEY, req.body.refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    })

    res.json({
      data: {
        message: 'Success',
      }
    })
  },
  async displayCookies  (req, res) {
    const context = { req, res }
    res.json({
      data: {
        cookies: nookies.get(context)
      }
    })
  },
  async regenerateToken(req, res) {
    const context = { req, res };
    const cookies = nookies.get(context);
    const refresh_token = cookies[REFRESH_TOKEN_KEY] || req.body.refresh_token;
    // console.log('regenerateToken');
    // console.log('refreshToken', refresh_token);

    const refreshRes = await httpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/refresh`, {
      method: 'POST',
      body: {
        refresh_token,
      }
    })

    if(refreshRes.ok){
      nookies.set(context, REFRESH_TOKEN_KEY, refreshRes.body.data.refresh_token, {
        httpOnly: true,
        sameSite: 'lax',  
        path: '/',
      })

      tokenService.save(refreshRes.body.data.access_token, context)

      //console.log(refreshRes.body.data.refresh_token);
      res.status(200).json({
        data: refreshRes.body.data,
      })
    } else {
      res.status(401).json({
        status: 401,
        message: 'Não autorizado',
      })
    }
  }
}

const controllerBy = {
  POST: controllers.storeRefreshToken,
  GET: controllers.regenerateToken,
  //GET: controllers.displayCookies,
  PUT: controllers.regenerateToken,
  DELETE: (req, res) => {
    const ctx = { req, res }
    nookies.destroy(ctx, REFRESH_TOKEN_KEY, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
    res.status(200).json({
      data: {
        message: 'deleted with success',
      }
    })
  }
}

export default function handler(req, res) {

  if(controllerBy[req.method]) return controllerBy[req.method](req, res);

  res.status(404).json({
    status: 404,
    message: 'Not found'
  })
}
