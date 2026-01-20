# Deployment Guide

## 🚀 Deploy to Vercel

### Quick Deploy (Recommended)

1. **Push to GitHub** (Already done! ✅)
   - Code is pushed to branch: `claude/naplan-numeracy-practice-mvp-sIELb`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import `projectuwb/NAPLAN-SIM-Numeracy`
   - Select branch: `claude/naplan-numeracy-practice-mvp-sIELb`

3. **Configure Build Settings**
   Vercel will auto-detect these settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at: `https://your-project-name.vercel.app`

### Alternative: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## 📋 Post-Deployment Checklist

After deployment, verify:

- [ ] Landing page loads correctly
- [ ] Can access Admin Portal at `/admin`
- [ ] Can create admin password
- [ ] Can generate student IDs
- [ ] Students can login with generated IDs
- [ ] Tests load with questions
- [ ] Timer counts down correctly
- [ ] Calculator appears for Year 7 from Q9
- [ ] Can submit test and see results
- [ ] Progress tracking works
- [ ] Focus mode unlocks after 3 tests
- [ ] Mobile responsive on phone/tablet

## 🧪 Testing Your Deployment

### 1. Admin Setup Test

```
1. Go to: https://your-app.vercel.app/admin
2. Create admin password: teacher123
3. Generate test student IDs:
   - Year 3 student: "Alice Test"
   - Year 5 student: "Bob Test"
   - Year 7 student: "Charlie Test"
4. Copy the generated IDs
```

### 2. Student Test Flow

```
1. Go to: https://your-app.vercel.app
2. Login with Year 3 student ID
3. Start a Full Mock Test
4. Answer a few questions
5. Navigate using question navigator
6. Submit test
7. Verify results page shows correctly
8. Return to dashboard
9. Repeat 2 more times to unlock Focus Mode
10. Test Focus Mode
```

### 3. Year 7 Calculator Test

```
1. Login with Year 7 student ID
2. Start a Full Mock Test
3. Go to question 9 or later
4. Verify calculator button appears
5. Click calculator and test operations
6. Close calculator
```

## 🔧 Environment Configuration

No environment variables needed! Everything runs client-side.

## 📊 Vercel Analytics (Optional)

To enable Vercel Analytics:

1. Go to your project dashboard on Vercel
2. Navigate to "Analytics" tab
3. Click "Enable"

This will track:
- Page views
- User sessions
- Performance metrics

## 🌐 Custom Domain (Optional)

To add a custom domain:

1. Go to project settings on Vercel
2. Navigate to "Domains"
3. Add your domain
4. Follow DNS configuration instructions

## 🔄 Continuous Deployment

Vercel automatically deploys on every push to your branch!

When you push changes:
```bash
git add .
git commit -m "Your changes"
git push origin claude/naplan-numeracy-practice-mvp-sIELb
```

Vercel will:
1. Detect the push
2. Run `npm install`
3. Run `npm run build`
4. Deploy to production
5. Send you a notification

## 📱 Preview Deployments

Every commit gets a unique preview URL for testing before production.

## 🐛 Troubleshooting Deployment

### Build Failed

**Check build logs on Vercel dashboard**

Common issues:
- Node version mismatch: Vercel uses Node 18 by default
- Missing dependencies: Ensure all deps are in `package.json`
- Build errors: Test locally with `npm run build`

### App Loads but Routes Don't Work

Vercel should auto-detect SPA routing, but if not:

Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### localStorage Not Working

- localStorage works fine in browsers
- No server-side configuration needed
- Data is stored per-domain

### Performance Issues

- Vite automatically optimizes bundle
- All images and assets are optimized
- Code splitting is automatic

## 📈 Monitoring

Monitor your app's performance:
- **Vercel Dashboard**: Real-time logs and metrics
- **Browser DevTools**: Check console for errors
- **Lighthouse**: Run performance audits

## 🔒 Security Notes

- Admin passwords are hashed before storage
- All data stored in browser localStorage
- No server-side data exposure
- HTTPS enabled by default on Vercel

## 💡 Pro Tips

1. **Use Preview Deployments**: Test changes before merging
2. **Enable Analytics**: Track usage patterns
3. **Set up Notifications**: Get alerts for deployments
4. **Use Environment Variables**: For future API integrations (if needed)

## 📞 Support

If you encounter issues:
1. Check Vercel build logs
2. Test build locally: `npm run build && npm run preview`
3. Review Vercel documentation: https://vercel.com/docs

---

## ✅ Deployment Complete!

Once deployed, share the URL with:
- Teachers for admin access
- Students for practice tests

Example URLs:
- **App**: `https://naplan-practice.vercel.app`
- **Admin**: `https://naplan-practice.vercel.app/admin`

**Happy Teaching! 🎓**
