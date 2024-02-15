
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNSimpuRnLivechatSpec.h"

@interface SimpuRnLivechat : NSObject <NativeSimpuRnLivechatSpec>
#else
#import <React/RCTBridgeModule.h>

@interface SimpuRnLivechat : NSObject <RCTBridgeModule>
#endif

@end
